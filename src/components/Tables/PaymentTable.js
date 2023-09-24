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

function MemberRow({ member, membersToPay, setMembersToPay }) {
  const paymentStatus = membersToPay[member.id]?.status;

  const payout =
    member.score && (member.coefficient || 1)
      ? member.score * (member.coefficient || 1)
      : 0;

  const isDisabled =
    Boolean(member.paid) ||
    payout === 0 ||
    paymentStatus === PaymentStatus.SUCCESS ||
    paymentStatus === PaymentStatus.IN_PROGRESS;

  const [toPay, setToPay] = useState(!isDisabled || false);

  const handleCheckboxChange = (e) => {
    console.log(
      "handleCheckboxChange called for member: ",
      member.id,
      "with checked value: ",
      e.target.checked
    );

    const currentStatus = membersToPay[member.id]?.status;

    if (
      currentStatus !== PaymentStatus.SUCCESS &&
      currentStatus !== PaymentStatus.IN_PROGRESS
    ) {
      setToPay(e.target.checked);
      setMembersToPay((prev) => ({
        ...prev,
        [member.id]: {
          ...prev[member.id],
          toPay: e.target.checked,
          status: e.target.checked ? PaymentStatus.PENDING : PaymentStatus.DONE,
        },
      }));
    }
  };

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
          onChange={handleCheckboxChange}
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

  useEffect(() => {
    const initialMembersToPay = {};
    memberDetails.forEach((member) => {
      if (member.attended) {
        const isPaid = Boolean(member.paid);
        const payout = member.score * (member.coefficient || 1); // Assume coefficient is 1 if not defined

        initialMembersToPay[member.id] = {
          toPay: !isPaid && payout !== 0,
          status:
            isPaid || payout === 0 ? PaymentStatus.DONE : PaymentStatus.PENDING,
        };
      }
    });

    setMembersToPay((prev) => {
      // Merge existing membersToPay with initialMembersToPay,
      // preserving existing statuses
      const updatedMembersToPay = { ...prev };
      for (const [id, member] of Object.entries(initialMembersToPay)) {
        if (!updatedMembersToPay[id]) {
          updatedMembersToPay[id] = member;
        } else {
          // Preserve the existing status
          updatedMembersToPay[id] = {
            ...member,
            status: updatedMembersToPay[id].status,
          };
        }
      }
      return updatedMembersToPay;
    });

    setIsLoading(false);
  }, [memberDetails]);

  useEffect(() => {}, [membersToPay]);

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
        {memberDetails
          .filter((member) => member.attended === true)
          .map((member) => (
            <MemberRow
              key={member.id}
              member={member}
              membersToPay={membersToPay}
              setMembersToPay={setMembersToPay}
            />
          ))}
      </TableBody>
    </Table>
  );
}

export default PaymentTable;
