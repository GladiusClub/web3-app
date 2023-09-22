import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
  Checkbox,
  CircularProgress,
} from "@mui/material";
import { CheckCircle } from "@mui/icons-material";

function MemberRow({ member, onToPayChange, membersToPay }) {
  const [toPay, setToPay] = useState(membersToPay[member.id]?.toPay || false); // corrected line

  const paymentStatus = membersToPay[member.id]?.status;

  const payout =
    member.score && member.coefficient ? member.score * member.coefficient : 0;

  const isDisabled = Boolean(member.paid) || payout === 0;

  return (
    <TableRow key={member.id}>
      <TableCell>{member.name}</TableCell>
      <TableCell>
        {member.paid ? new Date(member.paid).toLocaleDateString() : "Not Paid"}
      </TableCell>
      <TableCell>{payout}</TableCell>
      <TableCell>
        <Checkbox
          checked={toPay} // This will use the local state now.
          disabled={isDisabled}
        />
      </TableCell>
      <TableCell>
        {paymentStatus === PaymentStatus.IN_PROGRESS ? (
          <CircularProgress size={20} />
        ) : paymentStatus === PaymentStatus.SUCCESS ? (
          <CheckCircle style={{ color: "green" }} />
        ) : (
          paymentStatus
        )}
      </TableCell>
    </TableRow>
  );
}

const PaymentStatus = {
  PENDING: "payment pending",
  IN_PROGRESS: "payment in progress",
  FAILED: "payment failed",
  SUCCESS: "payment success",
  DONE: "No payment",
};

function PaymentTable({ memberDetails, membersToPay, setMembersToPay }) {
  const [isLoading, setIsLoading] = useState(true);

  console.log("membersToPay:", membersToPay); // log the member object

  useEffect(() => {
    const initialMembersToPay = {};
    memberDetails.forEach((member) => {
      if (member.attended) {
        const isPaid = Boolean(member.paid);
        const payout =
          member.score && member.coefficient
            ? member.score * member.coefficient
            : 0;
        initialMembersToPay[member.id] = {
          toPay: !isPaid && payout !== 0,
          status:
            isPaid || payout === 0 ? PaymentStatus.DONE : PaymentStatus.PENDING,
        };
      }
    });
    console.log("initialMembersToPay:", initialMembersToPay); // Log here

    setMembersToPay(initialMembersToPay);

    setIsLoading(false);
  }, [memberDetails]);

  useEffect(() => {
    console.log("membersToPay after set:", membersToPay);
  }, [membersToPay]);

  if (isLoading) return <p>Loading...</p>;

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Member</TableCell>
          <TableCell>Paid On</TableCell>
          <TableCell>Payout</TableCell>
          <TableCell>Pay</TableCell>
          <TableCell>Transaction Status</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {console.log("Rendering with membersToPay:", membersToPay)}
        {memberDetails
          .filter((member) => member.attended === true)
          .map((member) => (
            <MemberRow
              key={member.id}
              member={member}
              membersToPay={membersToPay}
            />
          ))}
      </TableBody>
    </Table>
  );
}

export default PaymentTable;
